import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // 프로필 페이지 CRUD 엔드포인트
  @UseGuards(JwtAuthGuard)
  @Post()
  createProfilePage(@Request() req, @Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.createProfilePage(req.user.id, createProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyProfilePages(@Request() req) {
    return this.profilesService.getProfilePagesByUserId(req.user.id);
  }

  @Get('by-path/:pagePath')
  getProfilePageByPath(@Param('pagePath') pagePath: string, @Request() req) {
    return this.profilesService.getProfilePageByPath(pagePath, req.ip);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getProfilePageById(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.getProfilePageById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateProfilePage(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfilePage(req.user.id, id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteProfilePage(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.profilesService.deleteProfilePage(req.user.id, id);
  }

  // 프로필 콘텐츠 CRUD 엔드포인트
  @UseGuards(JwtAuthGuard)
  @Post(':profileId/contents')
  createProfileContent(
    @Request() req,
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body() createContentDto: CreateContentDto,
  ) {
    return this.profilesService.createProfileContent(
      req.user.id,
      profileId,
      createContentDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('contents/:contentId')
  updateProfileContent(
    @Request() req,
    @Param('contentId', ParseIntPipe) contentId: number,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.profilesService.updateProfileContent(
      req.user.id,
      contentId,
      updateContentDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('contents/:contentId')
  deleteProfileContent(
    @Request() req,
    @Param('contentId', ParseIntPipe) contentId: number,
  ) {
    return this.profilesService.deleteProfileContent(req.user.id, contentId);
  }

  // 파일 업로드 엔드포인트
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.profilesService.uploadImage(req.user.id, file);
  }

  // 방문 통계 엔드포인트
  @UseGuards(JwtAuthGuard)
  @Get(':profileId/stats')
  getVisitStats(
    @Request() req,
    @Param('profileId', ParseIntPipe) profileId: number,
    @Query('period') period: 'day' | 'week' | 'month' = 'day',
  ) {
    return this.profilesService.getVisitStats(req.user.id, profileId, period);
  }

  // 신고 엔드포인트
  @Post(':profileId/report')
  reportAbusivePage(
    @Request() req,
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body('reportCategory') reportCategory: string,
    @Body('reportDetails') reportDetails: string,
  ) {
    // 로그인한 사용자의 경우 ID 사용, 비회원은 null 사용
    const userId = req.user?.id || null;
    return this.profilesService.reportAbusivePage(
      userId,
      profileId,
      reportCategory,
      reportDetails,
    );
  }

  // 관리자용 신고 관리 엔드포인트
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('reports')
  getAbuseReports(
    @Query('status') status: string,
    @Query('skip') skip = '0',
    @Query('take') take = '10',
  ) {
    return this.profilesService.getAbuseReports(status, +skip, +take);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('reports/:reportId')
  updateAbuseReportStatus(
    @Param('reportId', ParseIntPipe) reportId: number,
    @Body('status') status: 'PENDING' | 'REVIEWING' | 'RESOLVED',
  ) {
    return this.profilesService.updateAbuseReportStatus(reportId, status);
  }
}
